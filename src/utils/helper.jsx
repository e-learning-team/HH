import icons from "./icons"
const {AiOutlineStar,AiFillStar}=icons


export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(' ').join('-')
export const formatMoney =number=>Number(number?.toFixed(1)).toLocaleString()    


export const renderStarFromNumber=(number,size)=>{
    //4=>[1,1,1,1,0]
    const starts=[]
    number=Math.round(number)
    for (let i = 0 ; i <+number;i++) starts.push(<AiFillStar className="text-amber-400" size={size||16}/>)
    for (let i = 5 ; i >+number;i--) starts.push(<AiOutlineStar className="text-amber-400" size={size||16}/>)

    return starts
}
export const validate=(payload, setInvalidFields)=>{
    let invalids=0
    const formatPayload=Object.entries(payload)
    for(let arr of formatPayload){
        if(arr[1].trim()===''){
            invalids++
            setInvalidFields(prev=>[...prev, {name:arr[0],mes:'Require this field .'}])
        } 
    }
    for(let arr of formatPayload){
        switch(arr[0]){
            case 'email':
                const regex=/^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
                if(!arr[1].match(regex)){
                    invalids++
                    setInvalidFields(prev=>[...prev, {name:arr[0],mes:'Email invalid.'}])
                }
                break;
                case 'password':
                if(arr[1].lenght<6){
                    invalids++
                    setInvalidFields(prev=>[...prev, {name:arr[0],mes:'Password minimum 6 characters.'}])
                }
                break;
        default:
            break;
        }
    }
    return invalids
}
export const formatPrice=number=>Math.round(number/1000)*1000;

export const generateRange=(start, end)=>{
    const length=end+1-start
    return Array.from({length},(_, index)=>start+index)
}
export function getBase64(file){
    return new Promise((resolve, reject)=>{
        const reader= new FileReader()
        reader.readAsDataURL(file);
        reader.onload=()=>resolve(reader.result);
        reader.onerror=error=>reject(error);
    })
}