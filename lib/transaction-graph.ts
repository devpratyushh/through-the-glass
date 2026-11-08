export const transactionNodes=[{id:'A01',x:12,y:28},{id:'A02',x:35,y:12},{id:'A03',x:51,y:43},{id:'A04',x:15,y:72},{id:'A05',x:77,y:25},{id:'A06',x:40,y:85},{id:'A07',x:83,y:73}];
export const transactionEdges=[['A01','A02'],['A01','A03'],['A04','A03'],['A02','A05'],['A03','A05'],['A05','A07'],['A07','A03'],['A06','A03']];
export const transactionCycle=['A03','A05','A07'];
export const screenPoint=(node:{x:number;y:number})=>({x:65+node.x*9,y:180+node.y*4});
