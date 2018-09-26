package mysftp.rpc_api;

import java.rmi.Remote;

public interface SFTPServer extends Remote {
	public int runCommand(String command);
}
