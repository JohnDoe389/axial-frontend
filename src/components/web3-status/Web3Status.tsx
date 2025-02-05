import "./Web3Status.scss"

import React, { ReactElement, useEffect, useState } from "react"
import AccountDetails from "../account-detail/AccountDetails"
import ConnectWallet from "../connect-wallet/ConnectWallet"
import Identicon from "../Identicon"
import Modal from "../modal/Modal"
import { useTranslation } from "react-i18next"
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core"
import { addAvalancheNetwork } from "../../connectors"

const WALLET_VIEWS = {
  OPTIONS: "options",
  ACCOUNT: "account",
}

const Web3Status = (): ReactElement => {
  const { account, error } = useWeb3React()
  const [modalOpen, setModalOpen] = useState(false)
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const { t } = useTranslation()

  // always reset to account view
  useEffect(() => {
    if (modalOpen) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [modalOpen])

  return (
    <div className="walletStatus">
      {error instanceof UnsupportedChainIdError ?
        <button type="button" onClick={addAvalancheNetwork}>
          <div className="noAccount">{t("switchNetwork")}</div>
        </button>
      :<button type="button" onClick={(): void => setModalOpen(true)}>
        {account ? (
          <div className="hasAccount">
            <span className="address">
              {account.substring(0, 6)}...
              {account.substring(account.length - 4, account.length)}
            </span>

            <Identicon />
          </div>
        ) : (
          <div className="noAccount">{t("connectWallet")}</div>
        )}
      </button>}
      <Modal isOpen={modalOpen} onClose={(): void => setModalOpen(false)}>
        {account && walletView === WALLET_VIEWS.ACCOUNT ? (
          <AccountDetails
            openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
          />
        ) : (
          <ConnectWallet onClose={(): void => setModalOpen(false)} />
        )}
      </Modal>
    </div>
  )
}

export default Web3Status
