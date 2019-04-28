export type IDVKeywords = {
    id: string,
    list: [ string ]
}

export type IAnswers = {
    noun : [ string ],
    verb: [ string ],
    yesno: [ string ],
    arcyanswers: [ string ],
    jayce: [ string ],
    evolution: [ string ]
}

export type IDearViktor = {
    keywords: [ IDVKeywords ],
    answers: IAnswers 
}