export default async function handler(req, res) {
    // السماح فقط بطلبات POST
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { fileName, fileContent } = req.body;

    // جلب التوكن من "البيئة المخفية" في Vercel
    const TOKEN = process.env.GITHUB_TOKEN;

    try {
        const response = await fetch(`https://api.github.com/repos/mmuuu0475-blip/zaitoon-lab/contents/laps/${fileName}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `LAPS Secure Production Upload: ${fileName}`,
                content: fileContent
            })
        });

        if (response.ok) return res.status(200).json({ success: true });
        
        const errData = await response.json();
        return res.status(500).json(errData);
    } catch (error) {
        return res.status(500).send('Server Connection Error');
    }
}
