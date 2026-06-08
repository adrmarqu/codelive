import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Button from '@/components/common/Button/Button.jsx'
import { getUsersRequest, changeRoleRequest, deleteUserRequest } from '@/services/user.js'

import './UserList.css'

const ROLES = ['user', 'editor', 'admin'];

function UserList()
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState([]);
    const [sort, setSort] = useState('id');
    const [order, setOrder] = useState('asc');
    const [error, setError] = useState("");

    const fetchUsers = useCallback(async () =>
    {
        try
        {
            const params = {};
            if (search.trim()) params.search = search.trim();
            if (roleFilter.length) params.roles = roleFilter.join(',');
            if (sort !== 'id') { params.sort = sort; params.order = order; }

            const res = await getUsersRequest(params);
            setUsers(res.data);
            setError("");
        }
        catch
        {
            setError(t('list.error'));
        }
    }, [search, roleFilter, sort, order, t]);

    useEffect(() =>
    {
        const id = setTimeout(fetchUsers, 250);
        return () => clearTimeout(id);
    }, [fetchUsers]);

    const toggleRole = (r) =>
        setRoleFilter((prev) => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

    const handleRole = async (id, rol) =>
    {
        try { await changeRoleRequest(id, rol); await fetchUsers(); }
        catch (err) { setError(err.response?.data?.message || t('list.error')); }
    };

    const handleDelete = async (id, username) =>
    {
        if (!window.confirm(t('list.delete_confirm', { user: username }))) return;
        try { await deleteUserRequest(id); await fetchUsers(); }
        catch (err) { setError(err.response?.data?.message || t('list.error')); }
    };

    return (
        <section id="userlist-section">
            <h1>{t('list.title')}</h1>

            <div className="userlist-controls">
                <input
                    className="userlist-search"
                    type="text"
                    placeholder={t('list.search_placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="userlist-filters">
                    <div className="filter-group">
                        {ROLES.map((r) => (
                            <Button
                                key={r}
                                className="btn"
                                variant={roleFilter.includes(r) ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => toggleRole(r)}
                            >
                                {t(`role.${r}`)}
                            </Button>
                        ))}
                    </div>

                    <div className="filter-group">
                        <Button
                            className="btn btn-secondary"
                            onClick={() => setSort(sort === 'progress' ? 'name' : 'progress')}
                        >
                            {sort === 'progress' ? t('list.sort_progress') : t('list.sort_name')}
                        </Button>
                        <Button
                            className="btn btn-secondary"
                            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                        >
                            {order === 'asc' ? '↑' : '↓'}
                        </Button>
                    </div>
                </div>
            </div>

            {error && <p className="stats-error">{error}</p>}

            <div className="userlist-table">
                <div className="userlist-row userlist-head">
                    <span>ID</span>
                    <span>{t('form.user')}</span>
                    <span>{t('form.email')}</span>
                    <span>{t('list.role')}</span>
                    <span>{t('list.progress')}</span>
                    <span>{t('list.actions')}</span>
                </div>

                {users.map((u) => (
                    <div key={u.id} className="userlist-row">
                        <span data-label="ID">{u.id}</span>
                        <span data-label={t('form.user')}>{u.username}</span>
                        <span data-label={t('form.email')} className="userlist-email">{u.email}</span>
                        <span data-label={t('list.role')}>
                            <select
                                className="userlist-select"
                                value={u.rol}
                                onChange={(e) => handleRole(u.id, e.target.value)}
                            >
                                {ROLES.map((r) => <option key={r} value={r}>{t(`role.${r}`)}</option>)}
                            </select>
                        </span>
                        <span data-label={t('list.progress')}>{u.progress}</span>
                        <span data-label={t('list.actions')} className="userlist-actions">
                            <Button className="btn btn-warning" onClick={() => navigate(`/progress/${u.username}`)}>
                                {t('list.view')}
                            </Button>
                            <Button className="btn btn-danger" onClick={() => handleDelete(u.id, u.username)}>
                                {t('form.delete')}
                            </Button>
                        </span>
                    </div>
                ))}

                {users.length === 0 && !error && (
                    <p className="stats-empty">{t('list.empty')}</p>
                )}
            </div>
        </section>
    );
}

export default UserList
