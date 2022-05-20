import { hello } from '../main/hello';
// 不会被打包
import { helloA } from './hello';
const test1 = '早上好'

document.write(hello());

/* 
 * git 操作练习
 * 提交
 * 1. 提交所有文件到暂存区： git add .
 * 2. 提交指定文件到暂存区： git add index.js
 * 3. 提交某个文件夹到暂存区： git add [src]
 * 
 * 撤销
 * 1. 
*/