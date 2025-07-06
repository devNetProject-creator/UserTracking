using Microsoft.AspNetCore.SignalR;
using UserTracking.UI.Models;

namespace UserTracking.UI
{
    public class LocationHub : Hub
    {
        public async Task UpdateLocation(LocationViewModel location)
        {
            await Clients.Others.SendAsync("ReceiveLocation", location);
        }
    }
}
