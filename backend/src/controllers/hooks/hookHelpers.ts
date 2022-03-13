import crypto from "crypto";

export const hashHmac = (payload: string, secret: string) => {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
};

export const verifySignature = (
  signature: string,
  payload: string,
  secret: string
) => {
  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from("sha256=" + hashHmac(payload, secret), "utf8")
  );
};

export const newSecret = async (len: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(len, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString("base64"));
      }
    });
  });
};
