import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { cloneRepo, pullRepo, readRepoList, readRepoFileTime, readRepoFilesInfo, } from '../../src/doc-engine/github';
import { makeFullDir, removeFullDir, } from '../../src/util/file';

const testDir = path.join(__dirname, '..');

describe('src/doc-engine/github', function () {

  it('cloneRepo', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(testDir, '__assets__', 'dist', 'github', 'example-gitbook');
    if (fs.existsSync(localPath)) {
      removeFullDir(localPath);
    }
    makeFullDir(localPath);
    cloneRepo({
      user: 'yuzjs',
      repository: 'example-gitbook',
      localPath: localPath,
    }).then((res: any) => {
      should(fs.existsSync(path.join(localPath, 'README.md'))).be.deepEqual(true);
      done();
    }).catch(done)
  });

  it('readRepoList', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(testDir, '__assets__', 'dist', 'github', 'example-gitbook');
    readRepoList({
      localPath: localPath,
    }).then((res: any) => {
      should(res).be.deepEqual([
        'README.md',
        'SUMMARY.md',
        'docs/001.md',
        // 'docs/002.md',
        'docs/101.md',
        // 'docs/102.md',
        'images/yuz-logo.png'
      ]);
      done();
    }).catch(done)
  });


  it('readRepoFileTime', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(testDir, '__assets__', 'dist', 'github', 'example-gitbook');
    // const localPath = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'xxxx', 'xxxx');
    readRepoFileTime({
      localPath: localPath,
      filePath: 'README.md'
    }).then((res: any) => {
      should(parseInt(res.createTime) > 0).be.deepEqual(true);
      should(parseInt(res.modifiedTime) > 0).be.deepEqual(true);
      done();
    }).catch(done)
  });


  it('pullRepo', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(testDir, '__assets__', 'dist', 'github', 'example-gitbook');
    pullRepo({
      localPath: localPath,
    }).then((res: any) => {
      should(typeof res === 'string' && res.length > 0).be.deepEqual(true);
      done();
    }).catch(done)
  });


  it('readRepoFilesInfo', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(testDir, '__assets__', 'dist', 'github', 'example-gitbook');
    readRepoFilesInfo({
      localPath: localPath,
    }).then((res: any) => {
      should(Array.isArray(res) && res.length > 0).be.deepEqual(true);
      done();
    }).catch(done)
  });

  
});