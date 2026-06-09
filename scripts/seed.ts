import { hashPassword } from '../src/server/password';
import { sql } from '../src/lib/db';
import { branchDirectory } from '../src/lib/branch-directory';
import { roles as seedRoles } from '../src/server/catalog';

async function seed() {
  console.log('Seeding database...');

  try {
    for (const branch of branchDirectory) {
      const existing = await sql`SELECT id FROM branches WHERE id = ${branch.id}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO branches (id, code, name, timezone, status, address, phone, email)
          VALUES (${branch.id}, ${branch.code}, ${branch.name}, ${branch.timezone}, ${branch.status}, ${branch.address}, ${branch.phone}, ${branch.email})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }
    console.log(`  Branches seeded: ${branchDirectory.length}`);

    for (const role of seedRoles) {
      const existing = await sql`SELECT id FROM roles WHERE code = ${role.code}`;
      if (existing.length === 0) {
        const roleId = `role-${role.code}`;
        await sql`
          INSERT INTO roles (id, code, name)
          VALUES (${roleId}, ${role.code}, ${role.name})
          ON CONFLICT (code) DO NOTHING
        `;
      }
    }
    console.log(`  Roles seeded: ${seedRoles.length}`);

    const dbRoles = await sql`SELECT id, code FROM roles`;
    const dbPermissions = await sql`SELECT id, key FROM permissions`;
    const existingPermKeys = new Set(dbPermissions.map((p: any) => p.key));
    const roleMap = new Map(dbRoles.map((r: any) => [r.code, r.id]));

    for (const role of seedRoles) {
      for (const perm of role.permissions) {
        if (!existingPermKeys.has(perm)) {
          const permId = `perm-${perm.replace(':', '-')}`;
          await sql`
            INSERT INTO permissions (id, key)
            VALUES (${permId}, ${perm})
            ON CONFLICT (key) DO NOTHING
          `;
        }
      }
    }
    console.log(`  Permissions synced.`);

    const dbPerms = await sql`SELECT id, key FROM permissions`;
    const permMap = new Map(dbPerms.map((p: any) => [p.key, p.id]));

    for (const role of seedRoles) {
      const roleId = roleMap.get(role.code);
      if (!roleId) continue;
      for (const perm of role.permissions) {
        const permId = permMap.get(perm);
        if (!permId) continue;
        await sql`
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES (${roleId}, ${permId})
          ON CONFLICT DO NOTHING
        `;
      }
    }
    console.log(`  Role-permissions synced.`);

    const userData = [
      { id: 'user-admin', branchId: 'branch-pusat', fullName: 'Nadia Putri', email: 'admin@bimbel.one', phone: '+62 811 1111 111', password: process.env.DEMO_ADMIN_PASSWORD || 'Admin123!', roles: ['super_admin'], mfa: true },
      { id: 'user-finance', branchId: 'branch-pusat', fullName: 'Rizky Pratama', email: 'finance@bimbel.one', phone: '+62 812 2222 222', password: process.env.DEMO_FINANCE_PASSWORD || 'Finance123!', roles: ['finance'], mfa: true },
      { id: 'user-tutor', branchId: 'branch-bandung', fullName: 'Ayu Santika', email: 'ayu@bimbel.one', phone: '+62 813 3333 333', password: process.env.DEMO_TUTOR_PASSWORD || 'Tutor123!', roles: ['tutor'], mfa: false },
      { id: 'user-branch-admin', branchId: 'branch-jkt-selatan', fullName: 'Budi Wicaksono', email: 'budi@bimbel.one', phone: '+62 814 4444 444', password: process.env.DEMO_BRANCH_ADMIN_PASSWORD || 'Branch123!', roles: ['branch_admin'], mfa: true },
      { id: 'user-support', branchId: 'branch-surabaya', fullName: 'Siti Aminah', email: 'support@bimbel.one', phone: '+62 815 5555 555', password: process.env.DEMO_SUPPORT_PASSWORD || 'Support123!', roles: ['support'], mfa: false },
    ];

    for (const user of userData) {
      const existing = await sql`SELECT id FROM users WHERE id = ${user.id}`;
      if (existing.length === 0) {
        const passwordHash = hashPassword(user.password);
        await sql`
          INSERT INTO users (id, branch_id, full_name, email, phone, password_hash, status, is_mfa_required)
          VALUES (${user.id}, ${user.branchId}, ${user.fullName}, ${user.email}, ${user.phone}, ${passwordHash}, 'active', ${user.mfa})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }
    console.log(`  Users seeded: ${userData.length}`);

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }

  await sql.end();
}

seed();
