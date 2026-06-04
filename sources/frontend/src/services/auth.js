/* Login, Signin... */

export const checkForm = async (name, formData) =>
{
    try
    {
        const response = await fetch(`http://localhost:5000/api/auth/${name}`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Error al enviar");

        console.log("TOKEN:", data.token);

        if (name === 'login' && data.token)
            localStorage.setItem('token', data.token);

        return { success: true, data };
    }
    catch (error) 
    {
        return { success: false, error: error.message };
    }
};