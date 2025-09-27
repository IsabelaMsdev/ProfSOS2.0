#!/usr/bin/env node

console.log('🚀 SoS-prof MongoDB Test Runner\n');

const { spawn } = require('child_process');
const path = require('path');

// Test files in order of importance
const tests = [
  {
    name: 'Simple Connection Test',
    file: 'simple-test.js',
    description: 'Basic connection test with hardcoded credentials'
  },
  {
    name: 'Environment Test',
    file: 'test-connection.js',
    description: 'Connection test using .env file'
  },
  {
    name: 'User Management Test',
    file: 'test-users.js',
    description: 'Test user registration and management (requires server running)',
    requiresServer: true
  },
  {
    name: 'Integration Test',
    file: 'test-integration.js',
    description: 'Complete integration test (requires server running)',
    requiresServer: true
  }
];

async function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Running: ${test.name}`);
    console.log(`📝 ${test.description}`);
    
    if (test.requiresServer) {
      console.log('⚠️  This test requires the server to be running: node server.js');
    }
    
    console.log(`${'='.repeat(60)}\n`);
    
    const child = spawn('node', [test.file], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      console.log(`\n📊 Test "${test.name}" finished with exit code: ${code}`);
      resolve(code === 0);
    });
    
    child.on('error', (error) => {
      console.error(`❌ Error running test: ${error.message}`);
      resolve(false);
    });
  });
}

async function runAllTests() {
  console.log('🎯 Starting MongoDB connection tests...\n');
  console.log('📋 Tests to run:');
  tests.forEach((test, index) => {
    console.log(`   ${index + 1}. ${test.name}`);
  });
  
  const results = [];
  
  for (const test of tests) {
    const success = await runTest(test);
    results.push({ test: test.name, success });
    
    if (!success && !test.requiresServer) {
      console.log('\n🚨 Critical test failed. Stopping here.');
      console.log('💡 Fix the connection issue before running server-dependent tests.');
      break;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`   ${status} - ${result.test}`);
  });
  
  const passedCount = results.filter(r => r.success).length;
  console.log(`\n🎯 Results: ${passedCount}/${results.length} tests passed`);
  
  if (passedCount === 0) {
    console.log('\n🚨 CONNECTION ISSUE DETECTED');
    console.log('   This is likely due to:');
    console.log('   1. Corporate firewall blocking MongoDB connections');
    console.log('   2. Network restrictions');
    console.log('   3. MongoDB Atlas configuration issue');
    console.log('\n💡 Try running from a different network (home/mobile hotspot)');
  } else if (passedCount >= 2) {
    console.log('\n🎉 CONNECTION WORKING!');
    console.log('   MongoDB connection is successful.');
    console.log('   You can now start the server and run the application.');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start server: node server.js');
    console.log('   2. Test API: curl http://localhost:5000/health');
    console.log('   3. Run integration tests if server is running');
  }
  
  console.log('\n📝 Report these results back to the original developer.');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  const testName = args[0];
  const test = tests.find(t => t.file === testName || t.name.toLowerCase().includes(testName.toLowerCase()));
  
  if (test) {
    runTest(test);
  } else {
    console.log('❌ Test not found. Available tests:');
    tests.forEach(test => console.log(`   - ${test.file}`));
  }
} else {
  runAllTests();
}

module.exports = { runTest, runAllTests };
