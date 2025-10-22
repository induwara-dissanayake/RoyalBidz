using System;

namespace RoyalBidz.Server.Utils
{
    public static class TimeZoneHelper
    {
        private static TimeZoneInfo? _colomboTz;

        private static TimeZoneInfo ColomboTz
        {
            get
            {
                if (_colomboTz != null) return _colomboTz;
                try
                {
                    _colomboTz = TimeZoneInfo.FindSystemTimeZoneById("Sri Lanka Standard Time");
                }
                catch
                {
                    try
                    {
                        _colomboTz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Colombo");
                    }
                    catch
                    {
                        _colomboTz = TimeZoneInfo.Local;
                    }
                }
                return _colomboTz;
            }
        }

        // Return current time in Colombo local time (Kind = Unspecified)
        public static DateTime GetColomboNow()
        {
            var dt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, ColomboTz);
            return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
        }

        // Convert input DateTime to a Colombo-local DateTime (Kind = Unspecified)
        public static DateTime ToColomboLocal(DateTime dt)
        {
            if (dt.Kind == DateTimeKind.Utc)
            {
                var converted = TimeZoneInfo.ConvertTimeFromUtc(dt, ColomboTz);
                return DateTime.SpecifyKind(converted, DateTimeKind.Unspecified);
            }

            if (dt.Kind == DateTimeKind.Local)
            {
                var utc = dt.ToUniversalTime();
                var converted = TimeZoneInfo.ConvertTimeFromUtc(utc, ColomboTz);
                return DateTime.SpecifyKind(converted, DateTimeKind.Unspecified);
            }

            // Unspecified: assume it's already Colombo local time
            return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
        }
    }
}
