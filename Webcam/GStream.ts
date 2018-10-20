import * as ChildProcess from 'child_process';
import * as GStreamOSBin from './GStreamOSBin';

const Spawn = ChildProcess.spawn;

export class GStream
{
	private readonly binaryPath: string;

	public constructor ()
	{
		this.binaryPath = GStreamOSBin.getPath();
	}

	public spawnPipeline(pipeline: string)
	{
		return Spawn(this.binaryPath, pipeline.split(' '));
	}
}
