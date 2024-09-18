import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import csv from "csv-parser";

interface AirdropData {
  address: string;
  amount: string;
}

interface Proof {
  amount: string;
  proof: string[];
}

interface Proofs {
  [address: string]: Proof;
}

async function main(): Promise<void> {
  const values: [string, string][] = [];
  const proofs: Proofs = {};

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream("scripts/airdrop.csv")
      .pipe(csv())
      .on("data", (row: AirdropData) => {
        values.push([row.address, row.amount]);
      })
      .on("end", () => {
        const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
        console.log("Merkle Root:", tree.root);

        for (const [i, v] of tree.entries()) {
          const proof = tree.getProof(i);
          proofs[v[0]] = {
            amount: v[1],
            proof: proof,
          };
          console.log(`Address: ${v[0]}`);
          console.log("Proof:", proof);
          console.log("----------------------");
        }

        fs.writeFileSync(
          "scripts/merkleTree.json",
          JSON.stringify(tree.dump(), null, 2)
        );
        fs.writeFileSync(
          "scripts/proofs.json",
          JSON.stringify(proofs, null, 2)
        );

        console.log(
          "Merkle tree and proofs saved to scripts/merkleTree.json and scripts/proofs.json"
        );
        resolve();
      })
      .on("error", (err: Error) => {
        console.error("Error reading 'airdrop.csv':", err);
        reject(err);
      });
  });
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
