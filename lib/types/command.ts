export type ICommand = {
    keyword: string,
    text?: string,
    description?: string,
    isProtected?: boolean,
    isDisabled?: boolean,
    isModOnly?: boolean,        
    refusal?: string
}
export type ICommandSettings = {
    commandSymbol: string,
    list: [ ICommand ]
}
export type IEmbedField = {
    title: string,
    content: string,
    inline?: boolean
}
export type IExecuteText = {
    execute: (content:string) => string | void;
}
export type IExecuteEmbed = {
    execute: (title:string, fields:Array<IEmbedField>, color?:string) => string | void;
}
export type IExecuteCustom = {
    execute: (fn:Function, ...args:Array<any>) => any;
}