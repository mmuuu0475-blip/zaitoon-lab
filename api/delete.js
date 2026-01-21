export default async function handler(req, res) {
    // 1. السماح فقط بطلب الحذف (DELETE)
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed - استخدم DELETE للحذف' });
    }

    const { fileName } = req.body;

    // 2. التحقق من وجود اسم الملف
    if (!fileName) {
        return res.status(400).json({ message: 'يرجى تحديد اسم الملف المراد حذفه' });
    }

    try {
        const token = process.env.GITHUB_TOKEN; // التوكن ghp_ من إعدادات Vercel
        const owner = "mmuuu0475-blip";
        const repo = "zaitoon-lab";
        const path = `laps/${fileName}`;

        // 3. الخطوة الأولى: جلب بيانات الملف للحصول على قيمة SHA (ضروري للحذف في GitHub)
        const getFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!getFileResponse.ok) {
            const error = await getFileResponse.json();
            return res.status(getFileResponse.status).json({ message: 'الملف غير موجود أو تعذر الوصول إليه', details: error });
        }

        const fileData = await getFileResponse.json();
        const sha = fileData.sha; // هذه هي البصمة المطلوبة للحذف

        // 4. الخطوة الثانية: إرسال أمر الحذف النهائي باستخدام الـ SHA
        const deleteResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `LAPS Admin: Delete ${fileName}`,
                sha: sha,
                branch: "main" 
            })
        });

        if (deleteResponse.ok) {
            return res.status(200).json({ success: true, message: `تم حذف ${fileName} بنجاح` });
        } else {
            const deleteError = await deleteResponse.json();
            return res.status(deleteResponse.status).json({ success: false, message: 'فشل حذف الملف من GitHub', details: deleteError });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ success: false, message: 'خطأ داخلي في السيرفر' });
    }
}
