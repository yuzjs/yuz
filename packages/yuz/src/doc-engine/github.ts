import simpleGit, { SimpleGit } from 'simple-git';
import compose from 'koa-compose';
import { TypeGithubDocInfo } from './../types/github'

export async function cloneRepo(params: {
  user: string,
  repository: string,
  localPath: string,
}) {
  const { user, repository, localPath } = params;
  // const url = `git@github.com:${name}/${repo}.git`;
  const url = `https://github.com/${user}/${repository}.git`;
  const git: SimpleGit = simpleGit();
  const result = await git.clone(url, localPath);
  return result;
}

export async function readRepoList(params: { localPath: string, }): Promise<string[]> {
  const { localPath } = params;
  const git: SimpleGit = simpleGit({baseDir: localPath});
  let result: string = await git.raw('ls-tree', '-r', '--name-only', 'HEAD');
  const paths = result.replace(/\\r\\n/ig, '\n').split('\n');
  const list: string[] = [];
  paths.forEach((i) => {
    if (typeof i === 'string' && i.length > 0) {
      list.push(i);
    }
  });
  return list;
}

// export async function readRepoRemote(params: { localPath: string, }): Promise<string[]> {
//   const { localPath } = params;
//   const git: SimpleGit = simpleGit({baseDir: localPath});
//   let result: string = await git.raw('remote', 'show', 'origin');
//   const paths = result.replace(/\\r\\n/ig, '\n').split('\n');
//   const list: string[] = [];
//   paths.forEach((i) => {
//     if (typeof i === 'string' && i.length > 0) {
//       list.push(i);
//     }
//   });
//   return list;
// }


export async function readRepoFileTime(
  params: { localPath: string, filePath: string }
): Promise<{createTime: string, modifiedTime: string}> {
  const { localPath, filePath } = params;
  const git: SimpleGit = simpleGit({baseDir: localPath});
  // let modifiedStr: string = await git.raw('log', '-1', '--pretty=format:%at', '--', filePath);
  let timeRes: string = await git.raw('log', '--pretty=format:%at', '--', filePath);
  const times = timeRes.replace(/\r\n/, '\n').split('\n');
  return {
    createTime: times[times.length - 1],
    modifiedTime: times[0],
  };
}


export async function getRepoInfo(params: { localPath: string, }): Promise<TypeGithubDocInfo> {
  const list: string[] = await readRepoList(params);
  const info = {
    user: '',
    repository: '',
    src: {} 
  }
  return info;
}