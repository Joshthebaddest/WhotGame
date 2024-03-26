import { FaCircle } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { FaSquareFull } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import { IoTriangleSharp } from "react-icons/io5";

import { v4 as id } from 'uuid';


const numbers = [1,2,3,4,5,7,8,10,11,12,13,14,20]
const shapes = ["star", "square", "circle", "triangle", "cross"]

export const getCard = () => {
    const Card = []
    for(let number of numbers){
        for(let shape of shapes){
            if(number <= 8 ){
                Card.push({id: id(), number, suit: shape, icons: icons(shape), special: special(number) })  
            }
            else if(number > 8 && shape !== "star"){
                if(number === 20){
                    Card.push({id: id(), number, suit: 'Whot', icons: "Whot", special: "Whot"})
                }
                else{
                    Card.push({id: id(), number, suit: shape, icons: icons(shape), special: special(number)})
                }
            }
        }    
    }
    return Card
}

const special = (number) =>{
    switch (number) {
        case 1:
            return "holdon"
        case 2:
            return "pick2"
        case 5:
            return "pick3"
        case 8:
            return "suspension"
        case 14:
            return "general_market"
        default:
            break;
    }
}

const icons = (shape) =>{
    switch (shape) {
        case "circle":
            return <FaCircle className="text-purple-950" />
        case "square":
            return <FaSquareFull className="text-purple-950" />
        case "triangle":
            return <IoTriangleSharp className="text-purple-950" />
        case "cross":
            return <ImPlus className="text-purple-950" />
        case "star":
            return <IoMdStar className="text-purple-950" />
        default:
            break;
    }
}

export const shuffleCard = (card) => {
    for (let i = card.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [card[i], card[j]] = [card[j], card[i]];
    }
    return card;
}

export const shareCard = (deck, number) => {
    return deck.splice(0, number)
}

export const drawFromDeck = (deck, number) => {
    return deck.splice(0, number)
}
export const playCard = (deck) => {
    return deck.splice(0, 1)
}


export const getValue = (index) =>{
    switch (index) {
      case 0:
        return 'move-card1';
      case 1:
        return 'move-card2';
      case 2:
        return 'move-card3';
      case 3:
        return 'move-card4';
      case 4:
        return 'move-card5';
      default:
        break;
    }
  }

