import rawData from '@/store/rawData.json';

export interface RawDataEntry {
  datetime: string;
  username: string;
  firstName: string;
  lastName: string;
  company: string;
}

export function filterRawData(
  startDate: string,
  endDate: string,
  selectedCompanies: string[],
  searchUsername: string
): RawDataEntry[] {
  const data = rawData as RawDataEntry[];

  return data.filter((entry) => {
    // Filter by date range
    if (startDate || endDate) {
      const entryDate = new Date(entry.datetime);
      if (startDate && entryDate < new Date(startDate)) {
        return false;
      }
      if (endDate && entryDate > new Date(endDate + 'T23:59:59')) {
        return false;
      }
    }

    // Filter by companies (multiple selection)
    if (selectedCompanies.length > 0 && !selectedCompanies.includes(entry.company)) {
      return false;
    }

    // Filter by username (case-insensitive partial match)
    if (searchUsername && !entry.username.toLowerCase().includes(searchUsername.toLowerCase())) {
      return false;
    }

    return true;
  });
}

export function aggregateCompanyData(data: RawDataEntry[]) {
  const companyMap = new Map<string, {
    totalLogins: number;
    users: Set<string>;
    firstLogin: Date;
    lastLogin: Date;
  }>();

  data.forEach((entry) => {
    const existing = companyMap.get(entry.company);
    const entryDate = new Date(entry.datetime);

    if (existing) {
      existing.totalLogins++;
      existing.users.add(entry.username);
      if (entryDate < existing.firstLogin) existing.firstLogin = entryDate;
      if (entryDate > existing.lastLogin) existing.lastLogin = entryDate;
    } else {
      companyMap.set(entry.company, {
        totalLogins: 1,
        users: new Set([entry.username]),
        firstLogin: entryDate,
        lastLogin: entryDate
      });
    }
  });

  return Array.from(companyMap.entries()).map(([company, data]) => ({
    company,
    totalLogins: data.totalLogins,
    uniqueUsers: data.users.size,
    firstLogin: data.firstLogin.toISOString().split('T')[0],
    lastLogin: data.lastLogin.toISOString().split('T')[0]
  }));
}

export function aggregateUserData(data: RawDataEntry[]) {
  const userMap = new Map<string, {
    totalLogins: number;
    firstLogin: Date;
    lastLogin: Date;
    firstName: string;
    lastName: string;
    company: string;
  }>();

  data.forEach((entry) => {
    const existing = userMap.get(entry.username);
    const entryDate = new Date(entry.datetime);

    if (existing) {
      existing.totalLogins++;
      if (entryDate < existing.firstLogin) existing.firstLogin = entryDate;
      if (entryDate > existing.lastLogin) existing.lastLogin = entryDate;
    } else {
      userMap.set(entry.username, {
        totalLogins: 1,
        firstLogin: entryDate,
        lastLogin: entryDate,
        firstName: entry.firstName,
        lastName: entry.lastName,
        company: entry.company
      });
    }
  });

  return Array.from(userMap.entries()).map(([username, data]) => ({
    username,
    totalLogins: data.totalLogins,
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company,
    firstLogin: data.firstLogin.toISOString().split('T')[0],
    lastLogin: data.lastLogin.toISOString().split('T')[0]
  }));
}

export function aggregateTimeData(data: RawDataEntry[]) {
  const timeMap = new Map<string, number>();

  data.forEach((entry) => {
    const date = new Date(entry.datetime).toISOString().split('T')[0];
    timeMap.set(date, (timeMap.get(date) || 0) + 1);
  });

  return Array.from(timeMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
