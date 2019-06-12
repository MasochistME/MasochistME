export type IReactionDetails = {
    chance: number,
    emoji?: string,
    response?: string,
    function?: string,
}

export type IReaction = {
    id?: string,
    keywords: [ string ] | [ null ],
    reaction_list: [ IReactionDetails ]
}