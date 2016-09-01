import { PCleanMemory } from "./cleanMemory";
import { PBootstrap } from "./bootstrap";
import { Kernel } from "./../kernel/kernel";
import { Process, ProcessStatus } from "../kernel/process";

type RootMemory = {
    bootstrapped?: boolean,
    memoryCleanerPid?: ProcessId,
};

export class PRoot extends Process {
    public static className: string = "Root";
    public get className(): string { return PRoot.className; }
    private pmem: RootMemory;
    public readonly baseHeat: number = 1000; 
    public readonly service: boolean = true;

    public constructor(pid: ProcessId, parentPid: ProcessId) {
        super(pid, parentPid);
    }

    public run(): ProcessMemory | undefined {
        const kernel = <Kernel>this.kernel;
        const pmem = this.pmem;
        if (!pmem.bootstrapped && kernel.getProcessCount() <= 1) {
            console.log("Processes empty! Bootstrapping!");
            this.spawnChildProcess(PBootstrap);
            pmem.bootstrapped = true;
        }
        if (pmem.memoryCleanerPid === undefined) {
            pmem.memoryCleanerPid = this.spawnChildProcess(PCleanMemory);
        }
        return pmem;
    }

    public reloadFromMemory(pmem: ProcessMemory | undefined): void {
        this.pmem = (<RootMemory | undefined>pmem) || {
            bootstrapped: false,
        };
    }
}
