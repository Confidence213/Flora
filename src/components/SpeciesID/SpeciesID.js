import React, {useState} from 'react';
import './SpeciesID.css'

function SpeciesID(props) {
    const [input, setInput] = useState("");
    let votes = [
        {
            species: 'rabbit',
            votes: 30,
            user: 'foo',
        },
        {
            species: 'bird',
            votes: 2,
            user:  'bar',
        },
        {
            species: 'mushroom',
            votes: -5,
            user: 'baz',
        },
    ]
    let best = 0;
    let moderator = true;
    return (
        <div class="speciesid-overall">
            <div id="speciesid-list">
                {votes.map((vote, i) => {
                    let highlight = i === best;
                    return (
                        <div id={highlight? "speciesid-highlight" : "nohighlight"}>
                            {highlight ? <p>BEST ANSWER</p> : null}
                            <table class="speciesid-element">
                                <tr>
                                    <td class="speciesid-td">
                                        <button onClick={() => 
                                            {dummyVote(props.postid, i, true); 
                                            window.location.reload(true);}}>&#11014;</button>
                                        <button onClick={() => 
                                            {dummyVote(props.postid, i, false);
                                            window.location.reload(true);}}>&#11015;</button>
                                        {moderator ? 
                                            <button onClick={() => 
                                                {dummyModerator(props.postid, i);
                                                window.location.reload(true);}}>M&#10003;</button>
                                        :null}
                                    </td>
                                    <td class="speciesid-td">
                                        <span class="speciesid-votes">{vote.votes}</span>
                                    </td>
                                    <td class="speciesid-td">
                                        <span class="speciesid-species">{vote.species}</span>
                                        <br />
                                        <span class="speciesid-user">{"Submitted by " + vote.user}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    );
                    
                })}
                
            </div>
            <form id="speciesid-input">
                <input id="speciesid-textbox" placeholder="Suggest Species..." 
                value={input} onChange={(e) => setInput(e.target.value)}/>
                <span id="speciesid-formpad"></span>
                <button onClick={() => dummySubmit(props.postid, input)}>Suggest</button>
            </form>
        </div>
    );
}

function dummyVote(postid, i, type) {
    console.log("i voted");
}

function dummyModerator(postid, i) {
    console.log("i overrode");
}

function dummySubmit(postid, input) {
    console.log(input);
}

export default SpeciesID;