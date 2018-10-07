import * as ChildProcess from 'child_process';
import * as GStreamOSBin from './GStreamOSBin';

// const SpawnSync = ChildProcess.spawnSync;
const Spawn = ChildProcess.spawn;

export class GStream
{
	private readonly binaryPath: string;

	public constructor ()
	{
		this.binaryPath = GStreamOSBin.getPath();

		/*if (!this.getVersion() !== undefined) {
			throw new Error('GStream version not compatible');
		}*/
	}

	/*private getVersion (): string | undefined
	{
		let version = undefined;

		if (this.binaryPath) {
			const output = SpawnSync(
				this.binaryPath, ['--version'], {
					'timeout': 1000
				})
				.stdout;

			if (output && output.includes('GStreamer')) {
				const rawVersion = output
					.toString()
					.match(/GStreamer\s+.+/g);

				if (rawVersion) {
					version = rawVersion[0].replace(/GStreamer\s+/, '');
				}
			}
		}

		return version;

	}
*/
	public spawnPipeline(pipeline: string)
	{
		return Spawn(this.binaryPath, pipeline.split(' '));
	}
}
