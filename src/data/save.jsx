
    // game need to be able to acknowledge special card and implement them



    // players need to be able to win game
    checkPlayerWin = (playerId) => {
        const currentPlayer = playerState.filter( b=> b.id === playerId)[0]
        if(currentPlayer.hand.length < 1){
            // player win
        }
        else{
            // continue playing
        }

    }

    getCurrentPlayer = () => {
        const currentPlayer = playerState.filter( b=> b.id === playerId)[0]
        return currentPlayer
    }


    // players need to play only when it's their turn
    checkPlayerTurn = (playerId) => {
        if(player[this.playerTurn].id === getCurrentPlayer(playerId).id){
            // player turn
            
        }
        else{
            // not player turn
        }

    }


