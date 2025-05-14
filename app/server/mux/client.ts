import Mux from "@mux/mux-node";

const tokenId = process.env.MUX_TOKEN_ID;
const tokenSecret = process.env.MUX_TOKEN_SECRET;

if (!tokenId || !tokenSecret) {
  throw new Error(
    "Missing required Mux API credentials. Please check your environment variables.",
  );
}

const mux = new Mux({
  tokenId,
  tokenSecret,
});

export default mux;
