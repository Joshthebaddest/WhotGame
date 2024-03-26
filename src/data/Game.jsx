import { getCard, shareCard, shuffleCard, drawFromDeck } from "./card";

export class Game {

    constructor(playerState, dispatch, currentPlayer){
        this.players = playerState.map( player => new Player(player))   
        this.playerTurn = currentPlayer;
        this.update = dispatch
        this.Deck = shuffleCard(getCard())
        this.playedCard = []
    }

    start = () => this.share()

    // shared to each players
    share = () => {
        if(this.Deck.length > 58){
            for(let player of this.players){
                player.hand = shareCard(this.Deck, 5)
            }
            this.playedCard.push(...shareCard(this.Deck, 1))
        }
        return this.players
    }

    playTurn (player, prevCard, cardId) {
        const index = this.players.findIndex(obj => obj.id === player.id)
        if(this.playerTurn === index ){
            const { hand, foundCard } = this.players[index].playCard(prevCard, cardId)
            return  foundCard
        }   
        else{
            console.log('not your turn')
        }
    }

}



class Player {
    constructor(player) {
        this.name = player.name;
        this.hand = player.hand;
        this.id = player.id
        this.role = player.role
    }

    // players need to be able to draw card from deck
    recieveCard = (cards) => {
        this.hand.push(...cards)
        return this.hand
    }

    // players need to be able to play matching card
    playCard = (playedCard, cardId) => {
        const foundCard = this.hand.find(card => card.id === cardId)
        const index = this.hand.findIndex(obj => obj.id === foundCard.id)
        if(playedCard.number === foundCard.number || playedCard.suit === foundCard.suit){  
            this.hand.splice(index,1)
            return {hand: this.hand, foundCard, index}
        }
        else{
            console.log('error')
        }
    }
}



// const playCard = (player, playedCardId) => {
    
    // const prevPlayedCard = playedCard[playedCard.length-1]
    // const card = game.playTurn(player, prevPlayedCard, playedCardId)
    // const { hand, foundCard } = game.players[0].playCard(card, id)
    // const prev = {...state.filter( b => b.name === "josh")[0], hand}
    // if(card) {
    //     setPlayedCard(prev => [...prev, card])
    //     setCurrentPlayerIndex(currentPlayerIndex => currentPlayerIndex > state.length ? 0 : currentPlayerIndex+1)
    // }
// }



