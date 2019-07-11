import * as FS from 'fs';
import * as Path from 'path';
import * as OS from 'os';

const GST_LAUNCH_EXECUTABLE = 'gst-launch-1.0';

export function getPath (): string
{
	if (OS.platform() === 'win32') {

		return getWindowsBin();

	} else if (OS.platform() == 'linux') {

		return getLinuxBin();

	} else if (OS.platform() == 'darwin') {

		return getDarwinBin();
	}

	throw new Error('unsupported platform');
}

function getLinuxBin (): string
{
	// Look for GStreamer on PATH
	if (process.env.PATH) {
		const path_dirs = process.env.PATH.split(':');
		for (let index = 0; index < path_dirs.length; ++index) {
			try {
				const base = Path.normalize(path_dirs[index]);
				const bin = Path.join(
					base,
					GST_LAUNCH_EXECUTABLE);
				FS.accessSync(bin, FS.constants.F_OK);
				return bin;
			} catch (e) { /* no-op */ }
		}
	}

	throw new Error('GStream not found');
}

function getDarwinBin (): string
{
	try {
		const bin = '/usr/local/bin/gst-launch-1.0';
		FS.accessSync(bin, FS.constants.F_OK);
		return bin;
	} catch (e) { /* no-op */ }
	throw new Error('GStream not found');
}

function getWindowsBin (): string
{
	let bin = getWindowsGStreamArchitecture();

	if (bin) {

		bin = Path.join(
			bin,
			'bin',
			(`${GST_LAUNCH_EXECUTABLE}.exe`));

		try {
			FS.accessSync(bin, FS.constants.F_OK);
			return bin;
		} catch (e) {  /* no-op */  }

	} else {
		// Look for GStreamer on PATH
		if(process.env.PATH) {
			const pathDirs = process.env.PATH.split(';');

			for (let index = 0; index < pathDirs.length; ++index) {
				try {
					const base = Path.normalize(pathDirs[index]);
					const bin = Path.join(
						base,
						(`${GST_LAUNCH_EXECUTABLE}.exe`));
					FS.accessSync(bin, FS.constants.F_OK);
					return bin;
				} catch (e) { /* no-op */ }
			}
		}
	}

	throw new Error('GStream not found');

}

function getWindowsGStreamArchitecture (): string | undefined
{
	const detectedPath_x64 = process.env.GSTREAMER_1_0_ROOT_X86_64;
	const detectedPath_x32 = process.env.GSTREAMER_1_0_ROOT_X86;

	if (detectedPath_x64 || detectedPath_x32) {
		// If both variables are present, favor the architecture
		// of GStreamer which is the same as Node.js runtime.
		if (detectedPath_x64 && detectedPath_x32) {
			if (process.arch == 'x64')
				return detectedPath_x64;
			else if (process.arch == 'x32')
				return detectedPath_x32;
		} else {
			return detectedPath_x64 || detectedPath_x32;
		}
	}
}
