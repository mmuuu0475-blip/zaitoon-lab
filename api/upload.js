export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // يسمح برفع ملفات حتى 10 ميجابايت (يمكنك زيادتها)
        },
    },
};

export default async function handler(req, res) {
    // 1. السماح فقط بطلبات POST (الرفع)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed - استخدم POST للرفع' });
    }

    try {
        const { fileName, fileContent } = req.body;

        // 2. التحقق من وجود البيانات
        if (!fileName || !fileContent) {
            return res.status(400).json({ message: 'بيانات الملف ناقصة' });
        }

        // 3. قراءة التوكن السري من إعدادات Vercel
        const token = process.env.GITHUB_TOKEN;

        if (!token) {
            return res.status(500).json({ message: 'خطأ في السيرفر: GITHUB_TOKEN غير معرف في الإعدادات' });
        }

        // إعدادات المستودع
        const owner = "mmuuu0475-blip";
        const repo = "zaitoon-lab";
        const path = `laps/${fileName}`; // المسار داخل مجلد laps

        // 4. الاتصال بـ GitHub API لرفع الملف
        const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `LAPS Core: Auto-upload ${fileName}`,
                content: fileContent, // المحتوى مشفر بـ base64 كما يرسله كود الـ HTML
                branch: "main" // أو اسم الفرع الخاص بك
            })
        });

        const result = await githubResponse.json();

        if (githubResponse.ok) {
            return res.status(200).json({ 
                success: true, 
                message: 'تم الرفع بنجاح عبر بروتوكول LAPS',
                url: result.content.html_url 
            });
        } else {
            console.error('GitHub Error:', result);
            return res.status(githubResponse.status).json({ 
                success: false, 
                message: result.message || 'فشل الرفع إلى GitHub' 
            });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ success: false, message: 'خطأ داخلي في السيرفر الوسيط' });
    }
}
