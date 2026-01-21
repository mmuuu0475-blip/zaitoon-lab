export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { fileName, fileContent } = req.body;
    const TOKEN = process.env.GITHUB_TOKEN; // تأكد أنك وضعته في Vercel Settings

    try {
        const response = await fetch(`https://api.github.com/repos/mmuuu0475-blip/zaitoon-lab/contents/laps/${fileName}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `LAPS Secure Upload: ${fileName}`,
                content: fileContent
            })
        });

        if (response.ok) return res.status(200).json({ success: true });
        const error = await response.json();
        return res.status(500).json(error);
    } catch (err) {
        return res.status(500).send('Connection Error');
    }
}
