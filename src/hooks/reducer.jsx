export const player = [
    {
        id: 1,
        name: "josh",
        hand: [],
        role: "user"
    },
    {
        id:2,
        name: "WA",
        hand: [],
        role: "system"
    },
    // {
    //     id:3,
    //     name: "ZO",
    //     hand: [],
    //     role: "system"
    // },
    // {
    //     id:4,
    //     name: "BIA",
    //     hand: [],
    //     role: "system"
    // },
]

export const playerReducer = (state, action) => {
    switch (action.type) {
        case "UPDATING_DATA" :
            return [
                ...action.payload
            ]
        case "UPDATING_HAND":
            return [
                ...state,
                ...state.filter(obj => !state.some(item => item.id === action.payload.id))
            ]
        case "FETCH_SUCCESS":
            return {
                ...state,
                isPending: false,
                isError: false,
                data: action.payload,
            }
        case "FETCH_ERROR":
            return {
                ...state,
                isPending: false,
                isError: true,
                // data: {}
            }
        default:
            break;
    }

}