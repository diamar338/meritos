const fs = require('fs').promises;
const crypto = require('crypto');
const axios = require('axios');
const nodeCron = require('node-cron');

class PDFMonitor {
    constructor() {
        this.pdfUrl = 'https://wapp.registraduria.gov.co/GTH/concurso/documentos/DOCUMENTOS-GENERALES/cronograma_concurso-meritos-2025_RNEC.pdf';
        this.storagePath = './storage';
        this.lastHashFile = `${this.storagePath}/lastHash.txt`;
        this.logFile = `${this.storagePath}/changes.log`;
        this.io = null;
        this.init();
    }

    async init() {
        // Crear directorio de almacenamiento si no existe
        try {
            await fs.access(this.storagePath);
        } catch {
            await fs.mkdir(this.storagePath, { recursive: true });
        }

        // Iniciar monitoreo automático cada 30 minutos
        nodeCron.schedule('*/30 * * * *', () => {
            this.checkPDF();
        });

        console.log('🕒 Monitor programado cada 30 minutos');
    }

    setSocketIO(io) {
        this.io = io;
    }

    async checkPDF() {
        const timestamp = new Date().toLocaleString('es-CO', { 
            timeZone: 'America/Bogota' 
        });

        try {
            console.log(`🔍 Verificando cambios... ${timestamp}`);

            // Descargar PDF
            const response = await axios({
                method: 'GET',
                url: this.pdfUrl,
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            // Calcular hash
            const hash = crypto.createHash('sha256');
            hash.update(response.data);
            const currentHash = hash.digest('hex');

            // Leer hash anterior
            let previousHash = null;
            try {
                previousHash = await fs.readFile(this.lastHashFile, 'utf8');
            } catch (error) {
                // Archivo no existe, primera ejecución
            }

            const status = {
                timestamp,
                currentHash,
                previousHash,
                hasChanged: false,
                error: null,
                fileSize: response.data.length
            };

            if (previousHash && previousHash !== currentHash) {
                status.hasChanged = true;
                await this.handleChangeDetected(timestamp, currentHash);
            } else if (!previousHash) {
                // Primera ejecución, guardar hash
                await fs.writeFile(this.lastHashFile, currentHash);
                await this.logChange(`📝 Monitoreo iniciado - Hash inicial guardado`);
            }

            // Emitir actualización via WebSocket
            if (this.io) {
                this.io.emit('statusUpdate', status);
            }

            return status;

        } catch (error) {
            const errorStatus = {
                timestamp,
                error: error.message,
                hasChanged: false
            };

            await this.logChange(`❌ Error: ${error.message}`);
            
            if (this.io) {
                this.io.emit('statusUpdate', errorStatus);
            }

            return errorStatus;
        }
    }

    async handleChangeDetected(timestamp, newHash) {
        const message = `🚨 ¡CAMBIO DETECTADO! El PDF ha sido modificado - ${timestamp}`;
        
        console.log(message);
        await this.logChange(message);
        
        // Guardar nuevo hash
        await fs.writeFile(this.lastHashFile, newHash);

        // Emitir alerta
        if (this.io) {
            this.io.emit('changeDetected', {
                message,
                timestamp,
                newHash
            });
        }

        // Aquí puedes agregar notificaciones adicionales:
        // - Enviar email
        // - Enviar SMS
        // - Enviar mensaje a Telegram, etc.
    }

    async logChange(message) {
        const timestamp = new Date().toLocaleString('es-CO');
        const logEntry = `[${timestamp}] ${message}\n`;
        
        try {
            await fs.appendFile(this.logFile, logEntry);
        } catch (error) {
            console.error('Error escribiendo en log:', error);
        }
    }

    async getChangeHistory() {
        try {
            const logContent = await fs.readFile(this.logFile, 'utf8');
            return logContent.split('\n').filter(line => line.trim()).reverse();
        } catch (error) {
            return ['No hay historial disponible'];
        }
    }
}

module.exports = new PDFMonitor();