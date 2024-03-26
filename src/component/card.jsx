import React, { useEffect, useReducer, useState } from 'react'
import { drawFromDeck, getValue } from '../data/card';
import { player, playerReducer } from '../hooks/reducer';
import { Game } from '../data/Game';


function Card() {
    const [ state, dispatch ] = useReducer(playerReducer, player)
    const [ Deck,  setDeck ] = useState([])
    const [i, seti] = useState(0)
    const [playedCard, setPlayedCard] = useState([])
    const [currentPlayerIndex, setCurrentPlayerIndex] =  useState(0)
    const [pickedSpecial, setPickedSpecial] = useState(true)
    const [animate, setAnimate] = useState({})

    const game = new Game(state, dispatch, currentPlayerIndex) 

    useEffect(()=>{
        setDeck(game.Deck)
        setPlayedCard(game.playedCard)
        const players = game.start()
        const newPlayer = players.map(player => {
            const { id, name, hand, role } = player;
            return { id, name, hand, role }
        })
        dispatch({ type: "UPDATING_DATA", payload: newPlayer})
        const prevPlayedCard = game.playedCard[game.playedCard.length-1]
        if(prevPlayedCard.special === "pick2" || prevPlayedCard.special === "pick3" || prevPlayedCard.special === "general_market") setPickedSpecial(false)
    },[])

    useEffect(()=>{
        if(currentPlayerIndex){
            const user = state.find(user => user.role === "system")
            const prevPlayedCard = playedCard[playedCard.length-1]
            if(currentPlayerIndex === state.findIndex(obj => obj.id === user.id)){
                const cards = user.hand.filter(card => card.number === prevPlayedCard.number || card.suit === prevPlayedCard.suit)
                setTimeout(()=>{
                    if(cards.length>=1){
                        const played = playCard(user, cards[0].id)
                        if(!played) drawCard(state.findIndex(obj => obj.id === user.id))
                    }
                    else{
                        drawCard(state.findIndex(obj => obj.id === user.id))
                    }
                }, 2000)
            }
        }
    }, [currentPlayerIndex])

   
    const drawCard = (index) => {
        let card;
        const played = playedCard[playedCard.length-1]
        console.log(currentPlayerIndex)

        if(currentPlayerIndex === state.findIndex(obj => obj.role === "user")){
            index = currentPlayerIndex
        }

        if (played.special && !pickedSpecial) {
            switch (played.special) {
                case 'pick2':
                    card = drawFromDeck(Deck, 2);
                    break;
                case 'pick3':
                    card = drawFromDeck(Deck, 3);
                    break;
                case 'general_market':
                    card = drawFromDeck(Deck, 1);
                    break;
                default: 
                    break
            }
            setPickedSpecial(true)
        }else{
            card = drawFromDeck(Deck, 1)
        }

        if(card){
            const hand = game.players[index].recieveCard(card)
            const prev = {...state[index], hand}
            setCurrentPlayerIndex(currentPlayerIndex => currentPlayerIndex >= state.length-1 ? 0 : currentPlayerIndex+1)
            dispatch({ type: "UPDATING_HAND", payload: prev})
        }
    }

    const playCard = (player, playedCardId) => {
        let card
        const prevPlayedCard = playedCard[playedCard.length-1]
        if((prevPlayedCard.special === "pick2" || prevPlayedCard.special === "pick3" || prevPlayedCard.special === "general_market") && pickedSpecial === false) return false
        if(currentPlayerIndex === state.findIndex(obj => obj.role === "user")) Animation(playedCardId, prevPlayedCard)
        setTimeout(()=>{
            card = game.playTurn(player, prevPlayedCard, playedCardId)
  
            if(card) {
                if(card.special === "holdon" || card.special === "suspension"){
                    if(currentPlayerIndex === state.findIndex(obj => obj.role === "user")){
                        setCurrentPlayerIndex(currentPlayerIndex)
                    } 
                    else{
                        setCurrentPlayerIndex(null) 
                        setCurrentPlayerIndex(state.findIndex(obj => obj.role === "system"))
                    }
                    // setCurrentPlayerIndex(currentPlayerIndex <= 0 ? 0 : currentPlayerIndex-1);
                }
                // else if( card.special === "suspension"){
                //     console.log('suspension')
                //     if(currentPlayerIndex === state.findIndex(obj => obj.role === "user")){
                //         setCurrentPlayerIndex(currentPlayerIndex)
                //     } 
                //     else{
                //         setCurrentPlayerIndex(null) 
                //         setCurrentPlayerIndex(state.findIndex(obj => obj.role === "system"))
                //     }
                    // setCurrentPlayerIndex(currentPlayerIndex >= state.length-1 ? 0 : (currentPlayerIndex+2)%2);
                // }
                else if(card.special){
                    console.log("here")
                    setCurrentPlayerIndex(currentPlayerIndex => currentPlayerIndex >= state.length-1 ? 0 : currentPlayerIndex+1)
                    setPickedSpecial(false)
                }
                else{
                    setCurrentPlayerIndex(currentPlayerIndex => currentPlayerIndex >= state.length-1 ? 0 : currentPlayerIndex+1)
                }
                setPlayedCard(prev => [...prev, card])
            }
        }, 1000)
    }

    const Animation = (id, prev) => {
        const card = state[0].hand.find(obj => obj.id == id);
        if(prev.suit ===  card.suit || prev.number === card.number){
          const index = state[0].hand.findIndex(obj => obj.id === id)
          const value = getValue(index);
          setAnimate({index,value})
          setTimeout(()=>setAnimate({index: '', value: ''}), 1000)
        }
    }



  return (
    <>
        <div>
            <div className=''>
            {state.map(user => user.role !== "user" && (
                <div key={user.id} className='flex justify-between px-5 py-10'>
                    {user.hand.map(card => (
                        <div className='flex-shrink-0 ml-5 relative border-solid border-2 border-black h-fit w-[100px]' key={card.id} onClick={()=>playCard(state[0], card.id)}>
                        {card.number === 20 ? (
                        <div className='text-[20px]'>
                            <div className='text-[20px] pl-2 flex justify-start flex-col'>
                                <h1 className='ml-1'>{card.number}</h1>
                            </div>

                            <div className={`text-[20px] py-6 text-purple-950`}>
                                <div className='mx-auto w-fit'>
                                    {card.icons}
                                </div>
                                <div className='mx-auto w-fit rotate-180'>
                                    {card.icons}
                                </div>
                            </div>

                            <div className='flex justify-end pl-2 flex-col text-[20px] rotate-180'>
                                <h1 className='ml-2'>{card.number}</h1>
                            </div>
                        </div>) :
                        (<div className='text-[20px]' >
                            <div className='text-[20px] pl-2 flex justify-start flex-col'>
                                <h1 className='ml-1'>{card.number}</h1>
                                {card.icons}
                            </div>

                            <div className={`${card.suit === 'square' ? 'text-[50px] py-2': 'text-[65px]'} relative flex justify-center`}>
                                <div className='mx-auto w-fit'>
                                    {card.icons}
                                </div>
                            </div>

                            <div className='flex justify-end pl-2 flex-col text-[20px] rotate-180'>
                                <h1 className='ml-2'>{card.number}</h1>
                                {card.icons}
                            </div>
                        </div>
                        )}
                    </div>

                    // <div key={card.id} className={`${user.role === 'user' ? 'hidden': ''} text-[20px] text-white bg-purple-950 border-solid border-2 border-black py-12 h-[170px] w-[100px]`}>
                    //     <div className='text-[20px] pl-2 flex justify-start flex-col'>
                    //         <h1 className='ml-1'></h1>
                    //     </div>
                        
                    //     <div className={`text-[20px]`}>
                    //         <div className='mx-auto w-fit'>
                    //             <h1>Whot</h1>
                    //         </div>
                    //         <div className='mx-auto w-fit rotate-180'>
                    //             <h1>Whot</h1>
                    //         </div>
                    //     </div>

                    //     <div className='flex justify-end pl-2 flex-col text-[20px] rotate-180'>
                    //         <h1 className='ml-2'></h1>
                    //     </div>
                    // </div>
                    ))}
                </div>
            ))}
            </div>
         

            <div className='flex justify-around'>
                {playedCard[playedCard.length-1] && <div className='ml-5 relative border-solid border-2 border-black h-fit w-[100px]' key={playedCard[playedCard.length-1].number}>
                    <div className='text-[20px] pl-2 flex justify-start flex-col'>
                        <h1 className='ml-1'>{playedCard[playedCard.length-1].number}</h1>
                        {playedCard[playedCard.length-1].icons}
                    </div>

                    <div className={`${playedCard[playedCard.length-1].suit === 'square' ? 'text-[50px] py-2': 'text-[65px]'} relative flex justify-center`}>
                        <div className='mx-auto w-fit'>
                            {playedCard[playedCard.length-1].icons}
                        </div>
                    </div>

                    <div className='flex justify-end pl-2 flex-col text-[20px] rotate-180'>
                        <h1 className='ml-2'>{playedCard[playedCard.length-1].number}</h1>
                        {playedCard[playedCard.length-1].icons}
                    </div>
                </div>}
                
                <div className='flex' onClick={drawCard}>
                    <div className='text-[20px] text-white bg-purple-950 border-solid border-2 border-black py-12 h-[170px] w-[100px]'>
                        <div className='text-[20px] pl-2 flex justify-start flex-col'>
                            <h1 className='ml-1'></h1>
                        </div>

                        <div className={`text-[20px]`}>
                            <div className='mx-auto w-fit'>
                                <h1>Whot</h1>
                            </div>
                            <div className='mx-auto w-fit rotate-180'>
                                <h1>Whot</h1>
                            </div>
                        </div>

                        <div className='flex justify-end pl-2 flex-col text-[20px] rotate-180'>
                            <h1 className='ml-2'></h1>
                        </div>
                    </div>
                    {Deck[i] && <h1 className='ml-10'>({Deck.length})</h1>}
                </div>
            </div>
            

            <div className='flex mt-20'>
                {state[0].hand.map(card =>(
                    <div className={`${state[0].hand.findIndex(obj=> obj.id === card.id) === animate.index ? animate.value : '' } card flex-shrink-0 ml-5 relative border-solid border-2 border-black h-fit w-[100px]`} key={card.id} onClick={()=>playCard(state[0], card.id)}>
                        {card.number === 20 ? (
                        <div className='text-[20px]'>
                            <div className='text-[20px] pl-2 flex justify-start flex-col'>
                                <h1 className='ml-1'>{card.number}</h1>
                            </div>

                            <div className={`text-[20px] py-6 text-purple-950`}>
                                <div className='mx-auto w-fit'>
                                    {card.icons}
                                </div>
                                <div className='mx-auto w-fit rotate-180'>
                                    {card.icons}
                                </div>
                            </div>

                            <div className='flex justify-end pl-2 flex-col text-[20px] rotate-180'>
                                <h1 className='ml-2'>{card.number}</h1>
                            </div>
                        </div>

                        ) :
                        (<div className='text-[20px]' >
                            <div className='text-[20px] pl-2 flex justify-start flex-col'>
                                <h1 className='ml-1'>{card.number}</h1>
                                {card.icons}
                            </div>

                            <div className={`${card.suit === 'square' ? 'text-[50px] py-2': 'text-[65px]'} relative flex justify-center`}>
                                <div className='mx-auto w-fit'>
                                    {card.icons}
                                </div>
                            </div>

                            <div className='flex justify-end pl-2 flex-col text-[20px] rotate-180'>
                                <h1 className='ml-2'>{card.number}</h1>
                                {card.icons}
                            </div>
                        </div>
                        )}
                    </div>
                ))}
            </div>
            {/*
            <button className='bg-black p-5 text-white mx-auto' onClick={()=>shuffleCard(Deck)}>Shuffle</button>
            <button className='bg-black p-5 text-white mx-auto ml-10' onClick={share}>Share</button>
            */}
        </div>

    </>
  )
}

export default Card