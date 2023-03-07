export function userReducer(state = null, action:any) {
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            localStorage.clear();
            return action.payload;
        default:
            return state
    }
}
