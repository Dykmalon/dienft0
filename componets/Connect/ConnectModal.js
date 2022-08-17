/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
// import headerStyle from '../../styles/Header.module.css'
import { useWallet } from "../../lib/hooks/wallet";
import { shorter } from "../../lib/contract";
// import metaImg from '../';


export default function ConnectModal() {
  useEffect(() => {
    const isMetaMaskInstalled = () => {
      const { ethereum } = window;
      if (!ethereum) {
        setIsMetaMaskInstalled(false);
      } else {
        setIsMetaMaskInstalled(true);
      }
    };
    isMetaMaskInstalled();
  }, []);

  const { connectWallet, account, disconnectWallet, active } = useWallet();

  const [show, setShow] = useState(false);
  const [isMetamaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function connect(m) {
    if (m) {
      await connectWallet(true);
      setShow(false);
    } else {
      await connectWallet(false);
      setShow(false);
    }
  }
  async function disconnect() {
    await disconnectWallet();
  }

  function loadMetamaskbutton() {
    if (!isMetamaskInstalled) {
      return (
        <a
          className="btn-mask"
          href="https://metamask.app.link/"
        >
          <img src="https://logosarchive.com/wp-content/uploads/2022/02/Metamask-icon.svg" alt="metamask button" width="50" /> Metamask
        </a>
      );
    } else {
      return (
        <button
          className="btn-mask"
          onClick={() => {
            console.log("Login");
            
            connect(true);
          }}
        >
          <img src="https://logosarchive.com/wp-content/uploads/2022/02/Metamask-icon.svg" alt="metamask button" width="50" /> Metamask
        </button>
      );
    }
  }

  function showLoginButtons() {
    if (!active) {
      return (

        <>
          <button type="button" className="btn" onClick={handleShow}>
            Connect
          </button>
        </>
      );
    } else {
      return (
        <button type="button" className="btn"
          onClick={() => {
            disconnect();
          }}
        >
          {shorter(account)}
        </button>
      );
    }
  }

  return (
    <>
      {showLoginButtons()}

      <Modal show={show} onHide={handleClose} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton>
          <Modal.Title>Connect Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="connectbtns">
            {loadMetamaskbutton()}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
