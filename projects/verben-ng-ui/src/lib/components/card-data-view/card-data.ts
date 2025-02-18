export class CardData
{
  selected:boolean=false;
  title:string='';
  body:{title:string,value:string}[]=[];
  data?:any;
  children:CardData[]=[]
  isChildrenExpanded?:boolean=false
}