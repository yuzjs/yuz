import path from 'path';
import 'mocha';
import should from 'should';
import { loadJsonSync } from './../../src/util/file';

const projectJsonPath = path.join(__dirname,  '..', '..', 'example', 'project', 'project.json');

describe('src/util/file', function () {
  it('loadJsonSync()', function () {
    const json = loadJsonSync(projectJsonPath);
    should(json).be.deepEqual({ admin: { port: 8001 }, portal: { port: 8002 } });
  });
});