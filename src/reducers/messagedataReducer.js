const messageDataUpdate = (state=[], action) => {
    if(action.type === "UPDATEMESSAGEDATA"){
        console.log(action)
        if(action.body !== ''){
            state = [...state, { 
                "sender" : action.sender,
                "origin" : action.origin,
                "date" : action.date,
                "body" : action.body,
            }]
        }
        return state;
    }else{
        return state;
    }
}
export default messageDataUpdate;