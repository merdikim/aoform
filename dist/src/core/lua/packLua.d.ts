interface LuaModule {
    name: string;
    path: string;
    content?: string;
}
export declare function createExecutableFromProject(project: LuaModule[]): [string, LuaModule[]];
export declare function createProjectStructure(mainFile: string): LuaModule[];
export declare function pack(startFile: string): string;
export {};
//# sourceMappingURL=packLua.d.ts.map