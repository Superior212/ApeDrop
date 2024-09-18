import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import csv from "csv-parser";

interface AirdropEntry {
  user_address: string; // Ethereum address
  amount: number; // Token amount eligible for airdrop
}

const values: [string, number][] = []; // Array to store values from CSV
const feedFile = "scripts/airdrop.csv";

// Function to validate Ethereum address
const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Read the CSV file and populate the values array
fs.createReadStream(feedFile)
  .pipe(csv())
  .on("data", (row: AirdropEntry) => {
    if (isValidEthereumAddress(row.user_address)) {
      values.push([row.user_address, row.amount]);
    } else {
      console.error(`Invalid Ethereum address: ${row.user_address}`);
    }
  })
  .on("end", async () => {
    // Create a Merkle tree from the values
    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
    console.log("Merkle Root:", tree.root);

    // Write the tree to a JSON file asynchronously
    await fs.promises.writeFile(
      "tree.json",
      JSON.stringify(tree.dump(), null, 2)
    );

    // Load the tree from the JSON file
    try {
      const loadedTree = StandardMerkleTree.load(
        JSON.parse(await fs.promises.readFile("tree.json", "utf8"))
      );
      const proofs: any = {};

      // Iterate over the entries in the loaded tree
      for (const [i, v] of loadedTree.entries()) {
        // Get the proof for each address
        const proof = loadedTree.getProof(i);
        proofs[v[0]] = proof; // Store the proof with the address as the key

        // Check for a specific address and get the proof if found
        if (v[0] === "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2") {
          console.log("Proof for specific address:", proof);
        }
      }

      // Write all proofs to a JSON file asynchronously
      await fs.promises.writeFile(
        "scripts/proofs.json",
        JSON.stringify(proofs, null, 2)
      );
      console.log("All proofs have been saved to 'scripts/proofs.json'.");
    } catch (err) {
      console.error("Error reading or processing 'tree.json':", err);
    }
  })
  .on("error", (err: Error) => {
    console.error(`Error reading ${feedFile}:`, err);
  });

export const getAirdropList = async (): Promise<[string, number][]> => {
  return new Promise((resolve, reject) => {
    const values: [string, number][] = [];
    fs.createReadStream(feedFile)
      .pipe(csv())
      .on("data", (row: AirdropEntry) => {
        if (isValidEthereumAddress(row.user_address)) {
          values.push([row.user_address, Number(row.amount)]);
        } else {
          console.error(`Invalid Ethereum address: ${row.user_address}`);
        }
      })
      .on("end", () => {
        resolve(values);
      })
      .on("error", (err: Error) => {
        reject(err);
      });
  });
};
