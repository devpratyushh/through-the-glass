export const chapterPositions=[.025,.225,.425,.625,.755,.88];
export function chapterAt(p:number){return p<.2?0:p<.4?1:p<.6?2:p<.7?3:p<.82?4:5}
// Reserve an extra chapter while retaining the existing camera choreography.
export function sceneProgress(p:number){return p<.7?p:p<.82?.7+(p-.7)/.12*.04:.74+(p-.82)/.18*.26}
