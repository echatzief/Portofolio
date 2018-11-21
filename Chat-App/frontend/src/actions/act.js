
/* Change the input fields */
export function changeField(typ,value){
    return{
        type:typ,
        data:value,
    }
}

/* Change the warning box */
export function changeWarningBox(typ,vis,dat){
    return{
        type:typ,
        visibility:vis,
        data:dat,
    }
}