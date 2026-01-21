export default async function handler(req, res) {
    // إعدادات السماح بالاتصال (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { fileName, fileContent } = req.body;
    
    // التصحيح هنا: env وليس cnv
    const TOKEN = process.env.GITHUB_TOKEN; 

    try {
        const response = await fetch(`https://api.github.com/repos/mmuuu0475-blip/zaitoon-lab/contents/laps/${fileName}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Secure LAPS Upload: ${fileName}`,
                content: fileContent
            })
        });

        if (response.ok) return res.status(200).json({ success: true });
        const errorData = await response.json();
        return res.status(500).json(errorData);
    } catch (err) {
        return res.status(500).send('Connection Error');
    }
}
