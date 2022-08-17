import React, { useEffect, useState, useMemo } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import { encode as base64_encode } from 'base-64';
import { useWeb3React } from "@web3-react/core";
import ConnectModal from "../Connect/ConnectModal";
import axios from "axios";
import Image from 'next/image';
import logo from '../../public/images/die-logo.png';


export default function Hero(props) {
    const { account, active, library, deactivate } = useWeb3React();
    const { data: session, token, status, } = useSession();
    const [loading, setLoading] = useState();
    const [isTweet, setIsTweet] = useState(0);
    const [isCheckRegister, setIsCheckRegister] = useState(false);



    const [info, setInfo] = useState({
        _id: '',
        name: '',
        email: '',
        walletaddress: '',
        tweet: '',
    });

    useEffect(() => {
        if (status !== "loading" || !loading) {
            if (session) {
                fetchData();
            }
        }

    }, [status]);

    async function fetchData() {
        setLoading(true);
        axios.get(`https://us-central1-skull-apes-new.cloudfunctions.net/app/wallet/whitelist/${session.user.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

        ).then(res => {
            console.log(res.data.data)

            let data = res.data
            if (data.statusCode !== 201) {
                setIsCheckRegister(false)
                console.log("User doest Register Please register to whitelist!!");
            } else {
                console.log(res.data.data)
                setInfo(res.data.data);
                setIsCheckRegister(true);

                console.log("Successfully Retrive data!!!");
            }

        }).catch(err => {

            console.log(err.message);
        })
        setLoading(false);

    }



    //whitelist register logic start//

    async function whitelistRegister() {

        try {
            if (!isCheckRegister) {
                let result
                if (session.user.id !== '' && account) {
                    let inputData = {

                        uid: session.user.id,
                        name: session.user.name,
                        email: session.user.email,
                        walletaddress: account,
                        tweet: isTweet

                    }
                    result = await axios.post(`https://us-central1-skull-apes-new.cloudfunctions.net/app/wallet/whitelist/${session.user.id}`, inputData,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                }

                let data = result.data
                if (data.statusCode !== 201) {
                    toast.error(
                        "Your Already Registered"
                    );
                } else {
                    console.log("Successfully registered !!!");
                }
            }

        } catch (error) {
            console.log(error)
        }





    }

    //whitelist register logic end//



    return (
        <>
            <div className='main'>

                <div className="menu">
                    <div className="logo">
                        <Image
                            src={logo}
                            className="logo"
                            alt="logo"
                            width={'60px'}
                            height={'40px'}
                        />
                    </div>

                    <div className="sub-menu">

                        {status === "loading" || loading ? (<>
                            Loading Please wait.....
                        </>) : (<>
                            {isCheckRegister ? (<>

                                <div style={{ textAlign: "center" }}>
                                    Welcome  {info.name}<br />
                                    {info.walletaddress}<br />
                                    You Already Registered!!!
                                </div>


                            </>) : (<>

                                {!session ? (<>

                                    <button className="btn" onClick={() => signIn()}>Login</button>
                                </>) : (<>
                                    <div>
                                        {/* Signed in as {session.user.username}  */}
                                        
                                        <button className="btn" onClick={() => signOut()}>Sign out</button>
                                    </div>
                                </>)}

                                {isTweet === 0 ? (<>
                                    <button className="btn" target="_blank" onClick={() => setIsTweet(1)}
                                        href="https://twitter.com/intent/tweet?url=https://www.webniraj.com/2012/09/11/twitter-api-tweet-button-callbacks/&text=Something"><i className="icon-twitter-sign icon-white"></i>
                                        Tweet
                                    </button>

                                </>) : (<>
                                    <button disabled className="msg">Done!</button>
                                     
                                </>)}

                                <ConnectModal />
                                {isCheckRegister ? (<>
                                    You Already Registered!!!
                                </>) : (<>

                                    <button className="btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!account) {
                                                toast("Please Connect your Wallet");
                                            }
                                            if (!session) {
                                                toast("Please login to twitter");
                                            }
                                            if (isTweet === 0) {
                                                toast("Please Tweet");
                                            }


                                            whitelistRegister();
                                        }} disabled={isTweet === 0 || !session || !account}>
                                       Whitelist
                                    </button>

                                </>)}

                            </>)}

                        </>)}

                    </div>
                </div>
            </div>
        </>
    );
}
