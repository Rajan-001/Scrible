import axios from "axios"
export async function wordGenerator() {
  let word = ""
  try {
    const response = await axios.get(
      "https://random-word-api.vercel.app/api?words=1"
    )
    word = response.data[0]
  } catch (e) {
    word = "Pigeon"
  }
  return word
}
