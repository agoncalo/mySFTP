package mysftp.sftp_server;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

import mysftp.rpc_api.SFTPServer;

public class SFTPServerImpl implements SFTPServer {

	@Override
	public int runCommand(String command) {
		// TODO Auto-generated method stub
		return 0;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String host = args[0] != null ? args[0] : "localhost";
		int port = args[1] != null ? Integer.parseInt(args[1]) : 8000;
		
		try {
			SFTPServerImpl server = new SFTPServerImpl();
			SFTPServer stub = (SFTPServer)UnicastRemoteObject.exportObject(server, port);
			
			Registry registry = LocateRegistry.getRegistry(host, port);
			registry.bind("SFTPServer", stub);
			
			System.err.println("SFTP Server Ready on " + host + ", Port: " + port);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
