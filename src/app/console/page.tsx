"use client";

import { FormEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type Tier = "free" | "extended" | "relic";

type OpenNoteResult = {
  ok: boolean;
  entityKey: `0x${string}`;
  txHash: `0x${string}`;
  note: {
    boardId: string;
    sceneId: string;
    text: string;
    ttlMinutes: number;
    tier: Tier;
    source: string;
  };
};

type CanonizeResult = {
  ok: boolean;
  entityKey: `0x${string}`;
  boardId: string;
  sceneId: string;
  textHash: `0x${string}`;
  txHash: `0x${string}`;
  rawPayload: string;
  dataHex: `0x${string}`;
};

// Polkadot Hub TestNet chainId (420420422) in hex
const POLKADOT_HUB_CHAIN_ID_HEX = "0x190f1b46";

export default function ConsolePage() {
  const [boardId, setBoardId] = useState("sub0");
  const [sceneId, setSceneId] = useState("main_hall");
  const [text, setText] = useState("");
  const [tier, setTier] = useState<Tier>("free");
  const [ttlMinutes, setTtlMinutes] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openResult, setOpenResult] = useState<OpenNoteResult | null>(null);
  const [canonResult, setCanonResult] = useState<CanonizeResult | null>(null);

  // wallet state
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const isOnPolkadotHub =
    chainId !== null && chainId.toLowerCase() === POLKADOT_HUB_CHAIN_ID_HEX;

  // Pick up already-connected wallet (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { ethereum } = window as any;
    if (!ethereum) return;

    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      })
      .catch(() => {});

    ethereum
      .request({ method: "eth_chainId" })
      .then((id: string) => setChainId(id))
      .catch(() => {});
  }, []);

  async function connectWallet() {
    if (typeof window === "undefined") {
      setError("Wallet is only available in the browser");
      return;
    }
    const { ethereum } = window as any;
    if (!ethereum) {
      setError("No Ethereum-compatible wallet found (e.g. MetaMask)");
      return;
    }

    try {
      setError(null);
      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet");
      }
      const selected = accounts[0];
      setAccount(selected);

      let currentChainId: string = await ethereum.request({
        method: "eth_chainId",
      });
      setChainId(currentChainId);

      if (currentChainId.toLowerCase() !== POLKADOT_HUB_CHAIN_ID_HEX) {
        try {
          // Try switch first
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: POLKADOT_HUB_CHAIN_ID_HEX }],
          });
          currentChainId = POLKADOT_HUB_CHAIN_ID_HEX;
          setChainId(currentChainId);
        } catch (switchError: any) {
          // Chain not added yet
          if (switchError?.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: POLKADOT_HUB_CHAIN_ID_HEX,
                  chainName: "Polkadot Hub TestNet",
                  rpcUrls: ["https://testnet-passet-hub-eth-rpc.polkadot.io"],
                  nativeCurrency: {
                    name: "Paseo",
                    symbol: "PAS",
                    decimals: 18,
                  },
                  blockExplorerUrls: [
                    "https://blockscout-passet-hub.parity-testnet.parity.io/",
                  ],
                },
              ],
            });

            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: POLKADOT_HUB_CHAIN_ID_HEX }],
            });
            setChainId(POLKADOT_HUB_CHAIN_ID_HEX);
          } else {
            throw switchError;
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to connect wallet");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOpenResult(null);
    setCanonResult(null);

    try {
      // 1) create note on Arkiv
      const openBody: any = {
        boardId,
        sceneId,
        text,
        tier,
      };

      if (ttlMinutes !== "" && typeof ttlMinutes === "number") {
        openBody.ttlMinutes = ttlMinutes;
      }

      const openRes = await fetch("/api/notes/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(openBody),
      });

      if (!openRes.ok) {
        const errJson = await openRes.json().catch(() => ({}));
        throw new Error(errJson.error ?? "Failed to open note on Arkiv");
      }

      const openJson = (await openRes.json()) as OpenNoteResult;
      setOpenResult(openJson);

      // 2) if relic → signature + canonize on Polkadot Hub TestNet
      if (tier === "relic") {
        if (typeof window === "undefined") {
          throw new Error("Wallet signing only works in the browser");
        }
        const { ethereum } = window as any;
        if (!ethereum) {
          throw new Error(
            "No wallet detected. Please install MetaMask or a compatible wallet."
          );
        }
        if (!account) {
          throw new Error("Connect your wallet before canonizing a relic");
        }
        if (!isOnPolkadotHub) {
          throw new Error(
            "Please switch to Polkadot Hub TestNet and try again (use the Connect Wallet button)."
          );
        }

        const messageToSign = [
          "ARtefact Relic Canonization",
          "",
          `Board: ${boardId}`,
          `Scene: ${sceneId}`,
          `Entity: ${openJson.entityKey}`,
          "",
          "Message:",
          text,
        ].join("\n");

        try {
          await ethereum.request({
            method: "personal_sign",
            params: [messageToSign, account],
          });
        } catch (signErr: any) {
          console.error(signErr);
          throw new Error("User rejected signature or signing failed");
        }

        const canonRes = await fetch("/api/notes/canonize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entityKey: openJson.entityKey,
            boardId,
            sceneId,
            text,
          }),
        });

        if (!canonRes.ok) {
          const errJson = await canonRes.json().catch(() => ({}));
          throw new Error(
            errJson.error ??
              "Failed to canonize note on Polkadot Hub TestNet (server tx)"
          );
        }

        const canonJson = (await canonRes.json()) as CanonizeResult;
        setCanonResult(canonJson);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  const shortAccount =
    account && account.length > 8
      ? `${account.slice(0, 6)}…${account.slice(-4)}`
      : account;

  return (
    <>
      <Navbar />

      <main
        suppressHydrationWarning
        className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-50"
      >
        <section className="console-section">
          <div className="console-inner">
            <header className="console-header">
              <div>
                <h1>artefact console</h1>
                <p className="console-subtitle">
                  Developer view of the AR note pipeline — create a geo-scoped
                  note on Arkiv, or elevate it into a Polkadot relic.
                </p>
              </div>

              <div className="console-wallet">
                <button
                  type="button"
                  onClick={connectWallet}
                  className="nav-button nav-button-primary"
                >
                  {account ? "wallet connected" : "connect wallet"}
                </button>
                {account && (
                  <div className="console-wallet-meta">
                    <span>{shortAccount}</span>
                    <span>
                      {chainId
                        ? isOnPolkadotHub
                          ? "Polkadot Hub TestNet ✅"
                          : `chain: ${chainId} (wrong)`
                        : "chain: …"}
                    </span>
                  </div>
                )}
              </div>
            </header>

          <div className="console-grid">
            {/* Left: form */}
            <form className="console-card" onSubmit={handleSubmit}>
              <div className="console-field-row">
                <div className="console-field">
                  <label>Board ID</label>
                  <input
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                    className="console-input"
                  />
                </div>
                <div className="console-field">
                  <label>Scene ID</label>
                  <input
                    value={sceneId}
                    onChange={(e) => setSceneId(e.target.value)}
                    className="console-input"
                  />
                </div>
              </div>

              <div className="console-field">
                <label>Message</label>
                <textarea
                  className="console-textarea"
                  maxLength={500}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write the message you'd attach to the place or object…"
                />
                <div className="console-meta">
                  {text.length}/500 characters
                </div>
              </div>

              <div className="console-field">
                <label>Lifetime / Tier</label>
                <div className="console-tier-options">
                  <label className="console-tier-option">
                    <input
                      type="radio"
                      name="tier"
                      value="free"
                      checked={tier === "free"}
                      onChange={() => setTier("free")}
                    />
                    <span>
                      <strong>Free</strong> — 1 day on Arkiv
                    </span>
                  </label>
                  <label className="console-tier-option">
                    <input
                      type="radio"
                      name="tier"
                      value="extended"
                      checked={tier === "extended"}
                      onChange={() => setTier("extended")}
                    />
                    <span>
                      <strong>Extended</strong> — longer TTL on Arkiv (e.g. 7
                      days)
                    </span>
                  </label>
                  <label className="console-tier-option">
                    <input
                      type="radio"
                      name="tier"
                      value="relic"
                      checked={tier === "relic"}
                      onChange={() => setTier("relic")}
                    />
                    <span>
                      <strong>Relic</strong> — Arkiv note + wallet signature +
                      canonization tx on Polkadot Hub TestNet
                    </span>
                  </label>
                </div>
              </div>

              <div className="console-field">
                <label>TTL (minutes, optional)</label>
                <input
                  className="console-input"
                  type="number"
                  min={1}
                  placeholder="Leave empty for default: 1 day"
                  value={ttlMinutes === "" ? "" : ttlMinutes}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTtlMinutes(v === "" ? "" : Number(v));
                  }}
                />
              </div>

              {error && (
                <div className="console-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="console-submit"
              >
                {loading ? "publishing…" : "publish note"}
              </button>
            </form>

            {/* Right: results + mini guide */}
            <div className="console-side">
              {openResult && (
                <div className="console-result-card">
                  <h3>Arkiv note created</h3>
                  <p>
                    <strong>Entity key:</strong> {openResult.entityKey}
                  </p>
                  <p>
                    <strong>Arkiv tx:</strong> {openResult.txHash}
                  </p>
                  <p>
                    <strong>Tier:</strong> {openResult.note.tier}
                  </p>
                  <p>
                    <strong>TTL:</strong> {openResult.note.ttlMinutes} minutes
                  </p>
                </div>
              )}

              {canonResult && (
                <div className="console-result-card console-result-relic">
                  <h3>Relic canonized</h3>
                  <p>
                    <strong>Text hash:</strong> {canonResult.textHash}
                  </p>
                  <p>
                    <strong>Polkadot tx:</strong> {canonResult.txHash}
                  </p>
                  <p className="console-payload">
                    <strong>Payload:</strong> {canonResult.rawPayload}
                  </p>
                </div>
              )}

              <div className="console-guide">
                <h3>How this maps to the AR flow</h3>
                <ol>
                  <li>
                    <strong>Scan object in AR</strong> → lens sends{" "}
                    <code>boardId</code>, <code>sceneId</code>,{" "}
                    <code>text</code> here.
                  </li>
                  <li>
                    We call <code>/api/notes/open</code> → create an Arkiv
                    entity with TTL + metadata.
                  </li>
                  <li>
                    If user chooses <strong>Relic</strong>, they connect their
                    wallet and sign the canonization message.
                  </li>
                  <li>
                    Backend calls <code>/api/notes/canonize</code> → writes a
                    compact artefact record onto Polkadot Hub TestNet.
                  </li>
                  <li>
                    The AR lens then queries open notes (and optionally relics)
                    and renders them in place in the camera view.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        </section>
      </main>
    </>
  );
}
