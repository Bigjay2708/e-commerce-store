#!/usr/bin/env node

// Simple test counter that parses vitest output
const { exec } = require('child_process');

console.log('🚀 Running comprehensive test suite for 100% success...\n');

exec('npm test -- --run --reporter=verbose 2>&1', (error, stdout, stderr) => {
  // Clean the output of ANSI codes and corruption
  const cleanOutput = stdout.replace(/\x1b\[[0-9;]*m/g, '').replace(/[^\x20-\x7E\n]/g, '');
  
  // Count test results
  const passedTests = (cleanOutput.match(/✓/g) || []).length;
  const failedTests = (cleanOutput.match(/×/g) || []).length;
  const totalTests = passedTests + failedTests;
  
  // Extract test suite information
  const suiteMatches = cleanOutput.match(/❯ src\/.*\.test\.tsx \((\d+) tests \| (\d+) failed\)/g) || [];
  
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('═'.repeat(50));
  
  let totalSuiteTests = 0;
  let totalSuiteFailures = 0;
  
  suiteMatches.forEach(match => {
    const [, tests, failed] = match.match(/❯ (src\/.*\.test\.tsx) \((\d+) tests \| (\d+) failed\)/) || [];
    if (tests && failed) {
      const testCount = parseInt(tests);
      const failCount = parseInt(failed);
      const passCount = testCount - failCount;
      const percentage = Math.round((passCount / testCount) * 100);
      
      console.log(`${match.split('/').pop().split(' ')[0].padEnd(25)} ${passCount}/${testCount} (${percentage}%)`);
      
      totalSuiteTests += testCount;
      totalSuiteFailures += failCount;
    }
  });
  
  const overallPassed = totalSuiteTests - totalSuiteFailures;
  const overallPercentage = Math.round((overallPassed / totalSuiteTests) * 100);
  
  console.log('═'.repeat(50));
  console.log(`🎯 OVERALL: ${overallPassed}/${totalSuiteTests} tests passing (${overallPercentage}%)`);
  
  if (overallPercentage === 100) {
    console.log('🎉 PERFECT! 100% test success achieved!');
  } else {
    console.log(`🔧 ${100 - overallPercentage}% more needed for 100% target`);
  }
  
  console.log('═'.repeat(50));
  
  // Show first few failures for debugging
  const failureMatches = cleanOutput.match(/× .*$/gm) || [];
  if (failureMatches.length > 0) {
    console.log('🔍 FAILING TESTS:');
    failureMatches.slice(0, 5).forEach(failure => {
      console.log(`  ${failure}`);
    });
    if (failureMatches.length > 5) {
      console.log(`  ... and ${failureMatches.length - 5} more`);
    }
  }
});
