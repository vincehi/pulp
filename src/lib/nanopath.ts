import { isWindows } from '@tauri-apps/api/helpers/os-check';

import type { PathPlatform } from 'nanopath/dist/types';

import posix from '../../node_modules/nanopath/dist/posix'; 
import win32 from '../../node_modules/nanopath/dist/win32'; 

type SimplePathPlatform = Omit<PathPlatform, 'posix' | 'win32'>;

const Platform = (isWindows() ? win32 : posix);
const Path: SimplePathPlatform = Platform;

export default Path;