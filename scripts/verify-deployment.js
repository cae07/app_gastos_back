#!/usr/bin/env node

/**
 * Script de verificação de deploy na Vercel
 * 
 * Execute após o deploy com:
 * node scripts/verify-deployment.js https://seu-dominio.vercel.app
 * 
 * Ou use a variável de ambiente VERCEL_URL automaticamente:
 * node scripts/verify-deployment.js
 */

const https = require('https');
const http = require('http');

const deploymentUrl = process.argv[2] || process.env.VERCEL_URL;

if (!deploymentUrl) {
  console.error('❌ ERRO: URL de deployment não fornecida');
  console.error('Use: node scripts/verify-deployment.js <url>');
  console.error('Ou defina a variável de ambiente VERCEL_URL');
  process.exit(1);
}

const url = deploymentUrl.startsWith('http') 
  ? deploymentUrl 
  : `https://${deploymentUrl}`;

const healthUrl = new URL('/health', url);
const client = healthUrl.protocol === 'https:' ? https : http;

console.log(`🔍 Verificando saúde da aplicação em: ${healthUrl.toString()}`);

const request = client.get(healthUrl, { timeout: 5000 }, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const health = JSON.parse(data);

      if (res.statusCode === 200 && health.status === 'ok') {
        console.log('✅ Deployment verificado com sucesso!');
        console.log(`   Status: ${health.status}`);
        console.log(`   Database: ${health.database?.connected ? 'Conectado' : 'Desconectado'}`);
        console.log(`   Timestamp: ${health.timestamp}`);
        console.log(`   Uptime: ${Math.round(health.uptime)}s`);
        process.exit(0);
      } else {
        console.error(`❌ Saúde da aplicação comprometida`);
        console.error(`   Status: ${res.statusCode}`);
        console.error(`   Response:`, health);
        process.exit(1);
      }
    } catch (err) {
      console.error('❌ Erro ao processar resposta do health check');
      console.error('   Resposta:', data);
      console.error('   Erro:', err.message);
      process.exit(1);
    }
  });
});

request.on('error', (err) => {
  console.error('❌ Erro ao conectar ao deployment');
  console.error('   Erro:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('❌ Timeout ao testar deployment');
  request.destroy();
  process.exit(1);
});
